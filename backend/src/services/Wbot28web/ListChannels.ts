import { showHubToken } from "../../helpers/ShowHubToken";
import { logger } from "../../utils/logger";
import { Client } from "../Hub28web";
require("dotenv").config();

const ListChannels = async (tenantId: string): Promise<any> => {
  try {
    const hub28webToken = await showHubToken(tenantId);

    if (!hub28webToken) {
      throw new Error("HUB28WEB_TOKEN_NOT_FOUND");
    }

    const client = new Client(hub28webToken);

    const response = await client.getChannels();
    logger.info("" + JSON.stringify(response));
    return response;
  } catch (error: any) {
    logger.warn(" Error in ListChannels: ", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred: " + JSON.stringify(error));
    }
  }
};

export default ListChannels;