const USERS = [
  { name:"Arjun Kumar",  init:"AK", email:"arjun.k@company.com",  role:"QA Lead",    projects:4, lastActive:"Just now" },
  { name:"Priya Sharma", init:"PS", email:"priya.s@company.com",  role:"QA Engineer",projects:3, lastActive:"2h ago"   },
  { name:"Dev Tiwari",   init:"DT", email:"dev.t@company.com",    role:"QA Engineer",projects:2, lastActive:"4h ago"   },
  { name:"Anjali Rao",   init:"AR", email:"anjali.r@company.com", role:"Junior QA",  projects:1, lastActive:"1d ago"   },
  { name:"Rahul Mehta",  init:"RM", email:"rahul.m@company.com",  role:"Developer",  projects:2, lastActive:"3d ago"   },
  { name:"Sneha Patel",  init:"SP", email:"sneha.p@company.com",  role:"Manager",    projects:6, lastActive:"1w ago"   },
]

export default function Users() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Team Members &amp; Roles</span>
        <button className="btn btn-primary" style={{ fontSize:11 }}>+ Add User</button>
      </div>
      <table className="table">
        <thead>
          <tr><th>User</th><th>Email</th><th>Role</th><th>Projects</th><th>Last Active</th><th>Status</th></tr>
        </thead>
        <tbody>
          {USERS.map(u => (
            <tr key={u.name}>
              <td>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <div className="avatar" style={{ width:26, height:26, fontSize:10 }}>{u.init}</div>
                  <span>{u.name}</span>
                </div>
              </td>
              <td style={{ color:"var(--text3)", fontSize:11, fontFamily:"var(--mono)" }}>{u.email}</td>
              <td><span className="status-pill s-active">{u.role}</span></td>
              <td style={{ fontFamily:"var(--mono)" }}>{u.projects}</td>
              <td style={{ color:"var(--text3)", fontSize:11 }}>{u.lastActive}</td>
              <td><span className="status-pill s-pass">Active</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
