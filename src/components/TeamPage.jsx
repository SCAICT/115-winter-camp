import { teamGroupOrder, teamMembers } from '../data/teamMembers';
import SubpageLayout from './SubpageLayout';

const isLeader = ({ leader }, group) => leader === true || (Array.isArray(leader) && leader.includes(group));

// 依 teamGroupOrder 排列各組；同一個人屬於多個組別時，會出現在每一組，且各組的組長排最前面。
const groups = teamGroupOrder
  .map((group) => ({
    name: group,
    members: teamMembers.filter(({ groups: memberGroups }) => memberGroups.includes(group)).sort((a, b) => isLeader(b, group) - isLeader(a, group)),
  }))
  .filter(({ members }) => members.length > 0);

function MemberCard({ member, group }) {
  const { name, nameEn, realName, description, quote, website, avatar } = member;
  const body = (
    <>
      <span className="team-card__avatar">
        <img src={avatar} alt="" width="96" height="96" loading="lazy" decoding="async" />
        {isLeader(member, group) && <span className="team-card__lead">組長</span>}
      </span>
      <span className="team-card__text">
        <strong>{name}{realName && <small>{realName}</small>}</strong>
        <span className="team-card__en">{nameEn}</span>
        <span className="team-card__desc">{description}</span>
        {quote && <span className="team-card__quote">「{quote}」</span>}
      </span>
    </>
  );
  return website
    ? <a className="team-card" href={website} target="_blank" rel="noopener noreferrer" aria-label={`${name}（${group}）的個人網站`}>{body}</a>
    : <div className="team-card">{body}</div>;
}

// 認識籌備團隊 子頁：依組別列出工作人員，資料在 src/data/teamMembers.js。
export default function TeamPage() {
  return (
    <SubpageLayout skipTo="#team-content" skipLabel="跳到認識籌備團隊">
      <section id="team-content" className="section subpage-section team-page" aria-labelledby="team-page-title">
        <div className="wrap">
          <a className="topics-back" href="/#about" data-reveal><span aria-hidden="true">←</span> 回到首頁</a>
          <div className="about__intro" data-reveal>
            <h1 id="team-page-title">認識籌備團隊</h1>
          </div>
          <p className="about-summary" data-reveal>一個營隊不只有課表。讓四天三夜順利運作的，是課程、行政、活動、紀錄、資訊、設計與隊輔一起把細節接起來。共 {teamMembers.length} 位夥伴。</p>
          {groups.map(({ name, members }) => (
            <section className="team-group" aria-labelledby={`team-${name}`} key={name}>
              <h2 id={`team-${name}`} data-reveal>{name}<span>{members.length} 人</span></h2>
              <ul className="team-group__grid">
                {members.map((member) => <li key={member.name}><MemberCard member={member} group={name} /></li>)}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </SubpageLayout>
  );
}
