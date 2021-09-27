import React from "react";
import { Button } from "./components";

interface MenuProps {
  joinCode: string;
  setJoinCode: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

function Menu({ joinCode, setJoinCode, setPage }: MenuProps) {
  return (
    <div className="m-auto">
      <h3 className="mb-8">Start a new call?</h3>
      <div className="flex justify-center">
        <Button variant="contained" onClick={() => setPage("create")}>
          Create Call
        </Button>
      </div>

      <h3 className="my-8 pt-8">Join the existing call?</h3>
      <div className="flex items-center">
        <div>
          <input
            className="outline-none border-b-2 border-gray-200 focus:border-blue-400 px-3 py-2"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Join with code"
          />
        </div>
        <Button variant="outlined" onClick={() => setPage("join")}>
          Answer
        </Button>
      </div>
    </div>
  );
}

export default Menu;
