import { useEffect, useRef, useState } from "react";
import "./App.css";
import Board from "./Board";

function TravelHeader() {
  function handlePlanClick() {
    alert("여행 플래너를 시작합니다.");
  }

  return (
    <header className="travel-header">
      <a className="brand" href="#intro">VISIT<span>BUCHEON</span></a>
      <nav className="travel-nav">
        <a href="#intro">부천 여행</a>
        <a href="#info">가볼 만한 곳</a>
        <a href="#guide">여행 안내</a>
        <a href="#board">게시판</a>
      </nav>
      <a className="plan-link" href="#info" onClick={handlePlanClick}>
        여행 플래너 ＋
      </a>
    </header>
  );
}

function TravelIntro({ name, description }) {
  return (
    <section id="intro" className="travel-intro">
      <p className="intro-label">GYEONGGI-DO · SOUTH KOREA</p>
      <h1>{name}</h1>
      <p>{description}</p>
    </section>
  );
}

function TravelInfo({ label, children }) {
  const [selected, setSelected] = useState(false);

  return (
    <div className="travel-info">
      <strong>{label}</strong>
      <p>{children}</p>

      <button
        className="select-button"
        onClick={() => setSelected(!selected)}
      >
        {selected ? "✓ 일정에 담김" : "+ 일정에 담기"}
      </button>
    </div>
  );
}

function TravelClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return <time dateTime={now.toISOString()}>{now.toLocaleTimeString("ko-KR")}</time>;
}

function VisitInfo({ hours, fee = "무료" }) {
  const [people, setPeople] = useState(1);

  return (
    <section className="visit-info">
      <h2>방문 정보</h2>
      <p>운영시간: {hours}</p>
      <p>입장료: {fee}</p>
      <p>현재 시각: <TravelClock /></p>

      <div className="people-control">
        <span>여행 인원: {people}명</span>
        <button onClick={() => setPeople(people + 1)}>+ 1명</button>
      </div>
    </section>
  );
}

function GuideBox({ title, children }) {
  return (
    <section className="guide-box">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function TravelTip() {
  const [open, setOpen] = useState(false);

  return (
    <section className="travel-tip">
      <h2>부천 여행 Tip</h2>

      <button onClick={() => setOpen(!open)}>
        {open ? "접기" : "자세히 보기"}
      </button>

      {open && (
        <p>
          주말에는 주요 관광지 주변이 혼잡할 수 있으므로
          대중교통을 이용하면 더 편리하게 이동할 수 있습니다.
        </p>
      )}
    </section>
  );
}

function TravelMemo() {
  const [memo, setMemo] = useState("");
  const memoRef = useRef(null);

  useEffect(() => {
    const text = memo.trim();
    document.title = text
      ? `${text.slice(0, 12)} · 부천 여행`
      : "부천 여행 | VISIT BUCHEON";
  }, [memo]);

  return (
    <section className="travel-memo">
      <h2>나의 여행 메모</h2>
      <label htmlFor="travel-memo-input">여행 계획</label>
      <input
        id="travel-memo-input"
        ref={memoRef}
        value={memo}
        onChange={(event) => setMemo(event.target.value)}
        placeholder="여행 계획을 입력하세요..."
      />
      <button type="button" onClick={() => memoRef.current?.focus()}>
        메모 작성하기
      </button>
      {memo && <p>내 계획: {memo}</p>}
    </section>
  );
}

function WindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <p className="window-width">현재 창 너비: {width}px</p>;
}

function TodayPick() {
  const [pick, setPick] = useState(null);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setPick({ name: "부천아트벙커 B39", desc: "쓰레기 소각장을 개조한 복합문화예술공간" });
    }, 1200);
    return () => clearTimeout(timerId);
  }, []);

  return (
    <section className="today-pick">
      <h2>오늘의 추천</h2>
      {pick === null ? (
        <div className="pick-card" aria-busy="true">
          <strong className="loading">불러오는 중…</strong>
          <p>&nbsp;</p>
        </div>
      ) : (
        <div className="pick-card">
          <strong>{pick.name}</strong>
          <p>{pick.desc}</p>
        </div>
      )}
    </section>
  );
}

function TravelFooter() {
  return (
    <footer className="travel-footer">
      <p>VISIT BUCHEON</p>
      <small>경기도 부천시 여행 안내</small>
    </footer>
  );
}

function App() {
  return (
    <>
      <TravelHeader />
      <main>
        <TravelIntro
          name="경기도 부천"
          description="만화와 예술, 도심 속 공원과 계절의 꽃을 하루에 만날 수 있는 가까운 도시 여행지입니다."
        />

        <section id="info" className="info-section">
          <h2>부천에서 꼭 만나야 할 곳</h2>
          <TravelInfo label="원미산 진달래동산">부천의 대표 꽃 명소</TravelInfo>
          <TravelInfo label="한국만화박물관">만화와 캐릭터를 만나는 문화 공간</TravelInfo>
          <TravelInfo label="상동호수공원">도심 속 호수와 계절 정원</TravelInfo>
        </section>

        <TodayPick />
        <VisitInfo hours="관광지별 운영시간 확인" fee="공간별 상이" />

        <div id="guide" className="guide-layout">
          <GuideBox title="지하철로 가볍게 떠나요">
            <p>지하철 1호선과 7호선으로 주요 지역에 편리하게 이동할 수 있습니다.</p>
          </GuideBox>
          <GuideBox title="하루 여행 추천 코스">
            <ul>
              <li>한국만화박물관에서 부천의 문화 만나기</li>
              <li>상동호수공원에서 여유롭게 산책하기</li>
            </ul>
          </GuideBox>
        </div>

        <WindowWidth />
        <TravelTip />

        <TravelMemo />
        <Board />
      </main>
      <TravelFooter />
    </>
  );
}

export default App;