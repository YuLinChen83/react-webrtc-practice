import React from "react";

interface MenuProps {
  joinCode: string;
  setJoinCode: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

function Menu({ joinCode, setJoinCode, setPage }: MenuProps) {
  return (
    <div>
      <div>
        <button onClick={() => setPage("create")}>Create Call</button>
      </div>

      <div>
        <input
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Join with code"
        />
        <button onClick={() => setPage("join")}>Answer</button>
      </div>
    </div>
  );
}

export default Menu;
