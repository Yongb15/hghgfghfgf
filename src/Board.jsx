import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const emptyForm = { title: "", content: "" };

const adjectives = ["느긋한", "설레는", "용감한", "다정한", "호기심 많은", "부지런한", "명랑한", "꼼꼼한", "자유로운", "배고픈"];
const nouns = ["여행자", "산책자", "탐험가", "만화가", "사진가", "길잡이", "꽃구경꾼", "호수지기", "나그네", "미식가"];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomNickname() {
  return `${pick(adjectives)} ${pick(nouns)} ${Math.floor(Math.random() * 90) + 10}`;
}

function fetchPosts() {
  return supabase
    .from("posts")
    .select("id, author, title, content, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
}

function formatDate(iso) {
  return new Date(iso).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" });
}

export default function Board() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [nickname, setNickname] = useState(randomNickname);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function applyPosts({ data, error }) {
    if (error) setError("게시글을 불러오지 못했습니다.");
    else setPosts(data);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;
    fetchPosts().then((result) => {
      if (active) applyPosts(result);
    });
    return () => {
      active = false;
    };
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const post = {
      author: nickname,
      title: form.title.trim(),
      content: form.content.trim(),
    };
    if (!post.title || !post.content) {
      setError("제목과 내용을 모두 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    setError("");
    const { error } = await supabase.from("posts").insert(post);
    setSubmitting(false);
    if (error) {
      setError("글을 등록하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    setForm(emptyForm);
    applyPosts(await fetchPosts());
  }

  return (
    <section id="board" className="board">
      <h2>여행 이야기 게시판</h2>
      <p className="board-desc">부천 여행 후기나 추천 장소를 자유롭게 남겨주세요.</p>

      <form className="board-form" onSubmit={handleSubmit}>
        <div className="board-nickname">
          <span>
            닉네임: <strong>{nickname}</strong>
          </span>
          <button type="button" onClick={() => setNickname(randomNickname())}>
            다른 이름
          </button>
        </div>
        <input name="title" value={form.title} onChange={handleChange} placeholder="제목" maxLength={100} />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="내용" maxLength={2000} rows={4} />
        <button type="submit" disabled={submitting}>
          {submitting ? "등록 중…" : "글쓰기"}
        </button>
      </form>

      {error && <p className="board-error">{error}</p>}

      {loading ? (
        <p className="loading">불러오는 중…</p>
      ) : posts.length === 0 ? (
        <p className="board-empty">아직 글이 없습니다. 첫 글을 남겨보세요!</p>
      ) : (
        <ul className="board-list">
          {posts.map((post) => (
            <li key={post.id} className="board-post">
              <div className="board-post-head">
                <strong>{post.title}</strong>
                <span>{post.author} · {formatDate(post.created_at)}</span>
              </div>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
