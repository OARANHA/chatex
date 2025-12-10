require("dotenv").config();
import { showHubToken } from "../../helpers/ShowHubToken";
import socketEmit from "../../helpers/socketEmit";
import Contact from "../../models/Contact";
import Ticket from "../../models/Ticket";
import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";
import { logger } from "../../utils/logger";
import { pupa } from "../../utils/pupa";
import { Client, TextContent } from "../Hub28web";
import CreateMessageService from "./CreateMessageService";

export const SendTextMessageService = async (
  message: string,
  ticketId: number,
  contact: Contact,
  whatsapp: any
) => {

  let channel

  const ticket = await Ticket.findOne({
    where: { id: ticketId },
    include: [
      {
        model: Contact
      },
      {
        model: User
      }
    ]
  });

  let body = pupa(message || "", {
    protocol: ticket?.protocol || '',
    name: ticket?.contact?.name || '',
  });

  if(!whatsapp.tenantId || !whatsapp.type || !whatsapp.number){
    channel = await Whatsapp.findOne({
      where: { number: whatsapp.number }
    });
    whatsapp = channel
  }

  const hub28webToken = await showHubToken(
    whatsapp.tenantId.toString()
  );

  const client = new Client(hub28webToken);

  logger.info("ticket?.channel " + ticket?.channel);

  const channelType = ticket?.channel?.split('hub_')[1] || 'whatsapp';
  const channelClient = client.setChannel(channelType);

  const content = new TextContent(body);

  let contactNumber

  if(ticket?.channel === 'hub_facebook'){
    contactNumber = contact.messengerId
  }
  if(ticket?.channel === 'hub_instagram'){
    contactNumber = contact.instagramPK
  }

  try {
    logger.info("whatsapp.number " + whatsapp.number + " contactNumber "  + contactNumber + " content "  + content + " message "  + body);

    let response = await channelClient.sendMessage(
      whatsapp.number,
      contactNumber,
      content
    );

    logger.info("" + JSON.stringify(response));

    let data: any;

    // Tratar resposta do SDK 28web (ApiResponse<Message>)
    if (response && typeof response === 'object' && 'data' in response) {
      data = (response as any).data;
    } else if (typeof response === 'string') {
      // Compatibilidade com resposta string (legado)
      const responseStr = response as string;
      try {
        const jsonStart = responseStr.indexOf("{");
        const jsonResponse = responseStr.substring(jsonStart);
        data = JSON.parse(jsonResponse);
      } catch (error) {
        data = response;
      }
    } else {
      data = response;
    }

    const newMessage = await CreateMessageService({
      id: data.id,
      contactId: contact.id,
      body: body,
      ticketId,
      fromMe: true,
      tenantId: whatsapp.tenantId
    });

    if(ticket){
      await ticket.update({lastMessage: body || '', aswered: true})
      socketEmit({
        tenantId: whatsapp.tenantId,
        type: "ticket:update",
        payload: ticket
      });
    }

    return newMessage;
  } catch (error) {
    logger.warn("e7 " + JSON.stringify(error));
  }
};