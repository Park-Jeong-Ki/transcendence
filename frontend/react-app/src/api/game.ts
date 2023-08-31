import axios, { AxiosResponse } from "axios";
import * as cookies from "react-cookies";
import { base_url } from "./index";
import { UserType } from "@src/types";

// generate function is in user.ts

/**
 * 대전 신청
 * @method POST
 * @url /game/battle/offer
 * @param userID 대전 신청 상대 아이디
 * @returns
 */

export const offerBattle = async (
  awayUser: UserType,
  myData: UserType,
  gameRoomURL: string,
): Promise<AxiosResponse> => {
  const response = await axios.post(
    `${base_url}/game/battle/offer`,
    {
      awayUser: awayUser,
      myData: myData,
      gameRoomURL: gameRoomURL,
    },
    {
      headers: {
        Authorization: `Bearer ${cookies.load("jwt") as string}`,
      },
    },
  );
  return response;
};

export const acceptBattle = async (
  myData: UserType,
  awayUser: UserType,
  gameRoomURL: string,
): Promise<AxiosResponse> => {
  const response = await axios.post(
    `${base_url}/game/battle/accept`,
    {
      myData: myData,
      awayUser: awayUser,
      gameRoomURL: gameRoomURL,
    },
    {
      headers: {
        Authorization: `Bearer ${cookies.load("jwt") as string}`,
      },
    },
  );
  return response;
};