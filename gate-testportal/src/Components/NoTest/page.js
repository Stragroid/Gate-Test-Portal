import "./style.css";

export default function NoTestPage() {
  return (
    <>
      <div className="noTestBody">
        <div className="noTestMain">
          You don't have any upcoming tests yet.
          <button
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </button>
        </div>
      </div>
    </>
  );
}
