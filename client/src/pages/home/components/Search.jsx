export default function Search({ search, setSearch }) {
    return (
        <div className="user-search-area">
            <input
                type="text"
                className="user-search-text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <i className="fa fa-search user-search-btn" aria-hidden="true"></i>
        </div>
    );
}
