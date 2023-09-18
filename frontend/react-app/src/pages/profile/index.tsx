import NavBar from "@src/components/common/navBar";
import { routeMatch } from "@src/components/common/sideBar";
import { useRecoilState } from "recoil";
import * as DS from "../index.styled";
import * as S from "./index.styled";
import { MatchCard, MatchHeader } from "./container";
import { useEffect, useMemo, useState } from "react";
import { MatchHistoryType } from "@src/types/game.type";
import { allUserListState, userDataState } from "@src/recoil/atoms/common";
import { UserType } from "@src/types";
import { getHistoryById } from "@src/api/game";
import { useMatch } from "react-router-dom";

const Profile = () => {
  const currentRoute = useMatch("/profile/:userId");
  const SidebarComponent = routeMatch(
    currentRoute?.pathname ?? "",
    "/profile/",
  );
  const userId = useMemo(
    () => (currentRoute?.pathname ?? "").split("/").pop() as string,
    [currentRoute?.pathname],
  );
  const [userData] = useRecoilState(userDataState);
  const [userList] = useRecoilState(allUserListState);
  const [sortState, setSortState] = useState<string>("모드 전체");
  const [matchHistoryList, setMatchHistoryList] = useState<MatchHistoryType[]>(
    [],
  );
  const [sortedMatchHistory, setSortedMatchHistory] = useState<
    MatchHistoryType[]
  >([]);
  const [filteredHistoryList, setFilteredHistoryList] = useState<
    MatchHistoryType[]
  >([]);
  const [search, setSearch] = useState<string>("");
  const [moreInfo, setMoreInfo] = useState<number>(20);
  const [user, setUser] = useState<UserType>(userData);

  useEffect(() => {
    async function fetchHistory() {
      const response = await getHistoryById(userId);
      const data = response.data;
      setMatchHistoryList(data);

      const sortedData = [...data].sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      setSortedMatchHistory(sortedData);
      setFilteredHistoryList(sortedData);
    }

    fetchHistory();
  }, [userId]);

  useEffect(() => {
    if (sortState === "랭크") {
      setFilteredHistoryList(
        sortedMatchHistory
          .filter((history) => history.roomType === "RANKING")
          .filter(
            (history) =>
              history.player1.id === userId || history.player2.id === userId,
          ),
      );
    } else if (sortState === "일반") {
      setFilteredHistoryList(
        sortedMatchHistory
          .filter((history) => history.roomType !== "RANKING")
          .filter(
            (history) =>
              history.player1.id === userId || history.player2.id === userId,
          ),
      );
    } else {
      setFilteredHistoryList(
        sortedMatchHistory.filter(
          (history) =>
            history.player1.id === userId || history.player2.id === userId,
        ),
      );
    }
    setMoreInfo(20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortState]);

  useEffect(() => {
    console.log(sortedMatchHistory);
    if (search === "") {
      setFilteredHistoryList(
        sortedMatchHistory.filter(
          (history) =>
            history.player1.id === userId || history.player2.id === userId,
        ),
      );
    } else {
      setFilteredHistoryList((prev) =>
        [...prev].filter(
          (history) =>
            history.player2.nickname.includes(search) ||
            history.player1.nickname.includes(search),
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    const user = userList.find((user) => user.id === userId) as UserType;
    if (typeof user === "undefined") {
      setUser(userData);
    } else {
      setUser(user);
    }
  }, [currentRoute, userId, userList, userData]);

  if (!matchHistoryList || !SidebarComponent) {
    return <></>;
  } // TODO: 로딩 컴포넌트 추가

  return (
    <>
      <NavBar />
      <SidebarComponent user={user} />
      <DS.ContentArea>
        <MatchHeader
          userId={userId}
          historyList={filteredHistoryList}
          sortState={sortState}
          setSortState={setSortState}
          search={search}
          setSearch={setSearch}
        />
        <S.MatchContainer>
          {filteredHistoryList.slice(0, moreInfo).map((match) => (
            <MatchCard history={match} key={match.id}></MatchCard>
          ))}
          {moreInfo < filteredHistoryList.length && (
            <S.MoreInfoButton onClick={() => setMoreInfo((prev) => prev + 20)}>
              더보기
            </S.MoreInfoButton>
          )}
        </S.MatchContainer>
      </DS.ContentArea>
    </>
  );
};

export default Profile;
