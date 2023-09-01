import { ProfileButtonContainer } from "./index.styled";
import { profileRoleButtonMapping } from "./data";
import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import {
  addBlock,
  addFriend,
  deleteBlock,
  deleteFriend,
  getBlockList,
  getFriendList,
  offerBattle,
} from "@src/api";
import { useEffect, useState } from "react";
import { RoleType, UserType } from "@src/types";
import { IconButton } from "@src/components/buttons";
import { showProfileState, userDataState } from "@src/recoil/atoms/common";
import { ProfileModalOnClickHandler } from "@src/utils";
import { channelState, participantListState } from "@src/recoil/atoms/channel";
import channelButtons from "./channelButtons";
import BattleIcon from "@src/assets/icons/battle.svg";
import AddFriendIcon from "@src/assets/icons/addFriend.svg";
import DeleteFriendIcon from "@src/assets/icons/deleteFriend.svg";
import BlockIcon from "@src/assets/icons/block.svg";
import UnblockIcon from "@src/assets/icons/unblock.svg";
import SendMessageIcon from "@src/assets/icons/sendMessage.svg";
import ShowRecordIcon from "@src/assets/icons/showRecord.svg";
import BanChatIcon from "@src/assets/icons/banChat.svg";
import UnbanChatIcon from "@src/assets/icons/unbanChat.svg";
import KickIcon from "@src/assets/icons/kick.svg";
import SetAdminIcon from "@src/assets/icons/setAdmin.svg";
import UnsetAdminIcon from "@src/assets/icons/unsetAdmin.svg";

interface ProfileButtonActionsProps {
  role: RoleType; // "self" | "attendee" | "owner" | "admin"
}

interface ProfileButtonProps {
  buttons: { label: string; action: () => void; src: string }[];
}

const ProfileButtons: React.FC<ProfileButtonProps> = ({ buttons }) => {
  return (
    <ProfileButtonContainer>
      {buttons.map((button) => (
        <IconButton
          key={button.label}
          title={button.label}
          theme="LIGHT"
          onClick={button.action}
          iconSrc={button.src}
        />
      ))}
    </ProfileButtonContainer>
  );
};

export const ProfileButtonActions = ({ role }: ProfileButtonActionsProps) => {
  const [myData] = useRecoilState(userDataState);
  // 상대 프로필 유저
  const [user, setShowProfile] = useRecoilState(showProfileState);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  // 친구 상태인지 확인
  const checkFriend = async (): Promise<void> => {
    try {
      const response = await getFriendList();
      const friendList = response.data;
      console.log("friendList", friendList);
      const isFriend = friendList.some((friend) => friend.id === user.user.id);
      setIsFriend(isFriend);
    } catch (error) {
      console.log(error);
    }
  };

  // 차단 상태인지 확인
  const checkBlock = async (): Promise<void> => {
    try {
      const response = await getBlockList();
      const blockList = response.data;
      const isBlocked = blockList.some((block) => block.id === user.user.id);
      setIsBlocked(isBlocked);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddFriend = async (): Promise<void> => {
    try {
      const response = await addFriend(user.user.id);
      setIsFriend(true);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFriend = async (): Promise<void> => {
    try {
      const response = await deleteFriend(user.user.id);
      setIsFriend(false);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddBlock = async (): Promise<void> => {
    try {
      await addBlock(user.user.id);
      setIsBlocked(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBlock = async (): Promise<void> => {
    try {
      const response = await deleteBlock(user.user.id);
      setIsBlocked(false);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBattleOffer = async (): Promise<void> => {
    try {
      await offerBattle(user.user.id, myData).then((response) => {
        console.log(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const profileButtonData = [
    {
      label: "대전 신청",
      action: handleBattleOffer,
      src: BattleIcon,
    },
    {
      label: "친구 추가",
      action: handleAddFriend,
      src: AddFriendIcon,
    },
    {
      label: "친구 삭제",
      action: handleDeleteFriend,
      src: DeleteFriendIcon,
    },
    {
      label: "차단 하기",
      action: handleAddBlock,
      src: BlockIcon,
    },
    {
      label: "차단 해제",
      action: handleDeleteBlock,
      src: UnblockIcon,
    },
    {
      label: "DM 보내기",
      action: () => navigate(`/direct-message/${user.user.id}`),
      src: "src/assets/icons/sendMessage.svg",
    },
    {
      label: "전적 보기",
      action: () => {
        window.location.href = `/profile/${user.user.id}`;
        ProfileModalOnClickHandler(setShowProfile, false, {} as UserType);
      },
      src: ShowRecordIcon,
    },
  ];

  // 초기 상태 설정
  let filteredButtons = profileButtonData.filter((button) =>
    profileRoleButtonMapping[role].includes(button.label),
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkFriend();
        await checkBlock();
      } catch (error) {
        console.log(error);
      }
    };

    fetchData().catch((error) => console.log(error));
  }, [isFriend, isBlocked]);

  if (isFriend) {
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "친구 추가",
    );
  } else {
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "친구 삭제",
    );
  }

  if (isBlocked) {
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "차단 하기",
    );
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "친구 추가",
    );
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "친구 삭제",
    );
  } else {
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "차단 해제",
    );
  }

  // Set Channel Buttons
  const channel = useRecoilValue(channelState);
  const participants = useRecoilValue(participantListState);
  const me = participants.find((info) => info.user?.id === myData.id);
  const other = participants.find((info) => info.user?.id === user.user.id);

  if (channel != null && me && other) {
    const channelButtonSet = channelButtons(
      channel.id,
      user.user.id,
      setShowProfile,
    );

    if (me.owner) {
      if (other.admin) {
        filteredButtons.push(channelButtonSet.UnsetAdmin);
      } else {
        filteredButtons.push(channelButtonSet.SetAdmin);
      }
    }
    if ((me.owner || me.admin) && !other.owner) {
      if (other.muted) {
        filteredButtons.push(channelButtonSet.UnmuteUser);
      } else {
        filteredButtons.push(channelButtonSet.MuteUser);
      }
      filteredButtons.push(channelButtonSet.KickUser);
    }
  }

  return <ProfileButtons buttons={filteredButtons} />;
};
