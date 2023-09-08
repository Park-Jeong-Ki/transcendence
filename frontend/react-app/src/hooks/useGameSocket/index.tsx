import { userDataState } from "@src/recoil/atoms/common";
import {
  gameModalState,
  gameRoomChatListState,
  gameRoomInfoInitState,
  gameRoomInfoState,
  gameRoomListState,
  gameRoomURLState,
} from "@src/recoil/atoms/game";
import {
  battleActionModalState,
  gameAlertModalState,
} from "@src/recoil/atoms/modal";
import { gameSocket, gameSocketConnect } from "@src/router/socket/gameSocket";
import { OfferGameType, UserType } from "@src/types";
import {
  GameMapType,
  GameRoomInfoType,
  GameRoomType,
} from "@src/types/game.type";
import { useEffect } from "react";
import * as cookies from "react-cookies";
import { useRecoilState, useSetRecoilState } from "recoil";

const useGameSocket = () => {
  const setBattleActionModal = useSetRecoilState(battleActionModalState);
  const [userData, setUserData] = useRecoilState(userDataState);
  const setGameAlertModal = useSetRecoilState(gameAlertModalState);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
  const [gameRoomURL, setGameRoomURL] = useRecoilState(gameRoomURLState);
  const [gameRoomList, setGameRoomList] = useRecoilState(gameRoomListState);
  const [gameModal, setGameModal] = useRecoilState(gameModalState);
  const setGameRoomChatList = useSetRecoilState(gameRoomChatListState);
  const jwt = cookies.load("jwt");

  useEffect(() => {
    if (!jwt) {
      gameSocket.disconnect();
    } else {
      // console.log("gamesocket connected");
      gameSocket.off("roomList");
      gameSocket.on("roomList", (data: GameRoomInfoType[]) => {
        console.log("roomList", data, gameRoomURL);
        setGameRoomList(data);
        console.log(
          "roomList find",
          data.find((room) => room.roomURL === gameRoomURL)?.participants,
        );
        if (data.find((room) => room.roomURL === gameRoomURL) !== undefined) {
          setGameRoomInfo((prevInfo) => ({
            ...prevInfo,
            // ... 여기에 변경하고 싶은 값들을 넣습니다.
            ...data.find((room) => room.roomURL === gameRoomURL),
          }));
        }
        // else {
        //   setGameRoomInfo(gameRoomInfoInitState);
        // }
      });

      gameSocket.off("offerBattle");
      gameSocket.on("offerBattle", (data: OfferGameType) => {
        if (data.awayUser.id === userData.id) {
          setBattleActionModal({
            battleActionModal: true,
            awayUser: data.myData,
            gameRoomURL: data.gameRoomURL,
          });
        }
      });

      gameSocket.off("acceptBattle");
      gameSocket.on("acceptBattle", (data) => {
        console.log("acceptBattle", data, gameRoomURL);
        if (data.gameRoomURL === gameRoomURL) {
          console.log("acceptBattle", data);
          setGameRoomInfo(data.gameRoom);
          setGameRoomChatList([]);
          window.location.href = `/game/${data.gameRoomURL}`;
        }
      });

      gameSocket.off("rejectBattle");
      gameSocket.on("rejectBattle", (data) => {
        console.log("rejectBattle", data, userData);
        if (data.gameRoomURL === gameRoomURL) {
          if (data.awayUserId === userData.id) {
            setGameAlertModal({
              gameAlertModal: true,
              gameAlertModalMessage: "상대방이 대전 신청을 거절했습니다.",
              shouldRedirect: false,
              shouldInitInfo: true,
            });
          }
          setGameRoomChatList([]);
          setGameRoomInfo(data.gameRoom);
          setGameRoomURL("");
        }
      });

      gameSocket.on("startGame", (data) => {
        if (data.gameRoomURL !== gameRoomURL) return;
        setGameModal({
          ...gameModal,
          gameMap: "NORMAL" as GameMapType,
        });
      });

      gameSocketConnect(jwt);
    }

    return () => {
      // 소켓 이벤트 해제 로직 (cleanup function)
      gameSocket.off("offerBattle");
      gameSocket.off("acceptBattle");
      gameSocket.off("rejectBattle");
      // ... (다른 gameSocket 이벤트 해제 로직)
    };
  }, [jwt, gameRoomURL]); // 의존성 배열에 필요한 값들을 넣어주세요.
};

export default useGameSocket;