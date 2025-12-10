require("dotenv").config();
import { v4 as uuidV4 } from "uuid";
import { convertMp3ToMp4 } from "../../helpers/ConvertMp3ToMp4";
import { showHubToken } from "../../helpers/ShowHubToken";
import socketEmit from "../../helpers/socketEmit";
import Contact from "../../models/Contact";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";
import { logger } from "../../utils/logger";
import { Client, FileContent } from "../Hub28web";
import CreateMessageService from "./CreateMessageService";

export const SendMediaMessageService = async (
  media: Express.Multer.File,
  message: string,
  ticketId: number,
  contact: Contact,
  whatsapp: any
) => {

  let channel
  let mediaUrl

  const ticket = await Ticket.findOne({
    where: { id: ticketId }
  });

  if(!whatsapp.tenantId || !whatsapp.type || !whatsapp.number){
    channel = await Whatsapp.findOne({
      where: { id: whatsapp.id }
    });
    whatsapp = channel
    // whatsapp.type = channel?.type
  }

  const hub28webToken = await showHubToken(
    whatsapp.tenantId.toString()
  );

  logger.info("Chamou hub send media");

  const client = new Client(hub28webToken);

  logger.info("ticket?.channel " + ticket?.channel);

  const channelType = ticket?.channel?.split('hub_')[1] || 'whatsapp';
  const channelClient = client.setChannel(channelType);

  try{
    message = message.replace(/\n/g, " ");
  } catch(e){
    logger.warn("Replacing newlines: " + e.message);
  }

  logger.info("media " + JSON.stringify(media));

  const backendUrl = process.env.BACKEND_URL;

  const filename = encodeURIComponent(media.filename);
  mediaUrl = `${backendUrl}/public/${filename}`;

  if (media.mimetype.includes("image")) {
    if (channelType === "telegram") {
      media.mimetype = "photo";
    } else {
      media.mimetype = "image";
    }
  } else if (
    (channelType === "telegram" || channelType === "facebook") &&
    media.mimetype.includes("audio")
  ) {
    media.mimetype = "audio";
  } else if (
    (channelType === "telegram" || channelType === "facebook") &&
    media.mimetype.includes("video")
  ) {
    media.mimetype = "video";
  } else if (channelType === "telegram" || channelType === "facebook") {
    media.mimetype = "file";
  }

  try {

    if (media.originalname.includes('.mp3') && channelType === "instagram") {
      const inputPath = media.path;
      const outputMP4Path = `${media.destination}/${media.filename.split('.')[0]}.mp4`;
      try {
        await convertMp3ToMp4(inputPath, outputMP4Path);
        media.filename = outputMP4Path.split('/').pop() ?? 'default.mp4';
        mediaUrl = `${backendUrl}/public/${media.filename}`;
        media.originalname = media.filename
        media.mimetype = 'audio'
      } catch(e){

      }
    }

    if (media.originalname.includes('.mp4') && channelType === "instagram") {
      media.mimetype = 'video'
    }

    const content = new FileContent(
      mediaUrl,
      media.mimetype,
      media.filename,
      media.filename
    );

    let contactNumber

    if(ticket?.channel === 'hub_facebook'){
      contactNumber = contact.messengerId
    }
    if(ticket?.channel === 'hub_instagram'){
      contactNumber = contact.instagramPK
    }

    logger.info("whatsapp.number " + whatsapp.number + " contactNumber "  + contactNumber + " content "  + content + " message "  + message);

    let response = await channelClient.sendMessage(
      whatsapp.number,
      contactNumber,
      content
    );

    logger.info("Hub response: " + JSON.stringify(response));

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
      id: data?.id || uuidV4(),
      contactId: contact.id,
      body: `${media.filename}`,
      ticketId,
      fromMe: true,
      tenantId: whatsapp.tenantId,
      fileName: `${media.filename}`,
      mediaType: media.mimetype.split("/")[0] || media.mimetype,
      originalName: media.originalname
    });

    if(ticket){
      await ticket.update({lastMessage: media.filename || '', aswered: true})
      socketEmit({
        tenantId: whatsapp.tenantId,
        type: "ticket:update",
        payload: ticket
      });
    }

    return newMessage;
  } catch (error) {
    logger.warn("e6 " + JSON.stringify(error));
  }
};