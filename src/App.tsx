import React, { useState } from "react";
import Menu from "./Menu";
import Videos from "./Videos";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [joinCode, setJoinCode] = useState("");

  return (
    <div className="w-full h-full flex justify-center px-8">
      {currentPage === "home" ? (
        <Menu
          joinCode={joinCode}
          setJoinCode={setJoinCode}
          setPage={setCurrentPage}
        />
      ) : (
        <Videos mode={currentPage} callId={joinCode} setPage={setCurrentPage} />
      )}
    </div>
  );
}

export default App;
