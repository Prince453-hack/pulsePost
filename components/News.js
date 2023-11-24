export default function News({ article }) {
  return (
    <a rel="noreferrer" href={article.url} target="_blank">
      <div className="flex items-center justify-between px-4 py-2 space-x-1 hover:bg-gray-700 transition duration-200">
        <div className="space-y-0.5">
          <h6 className="text-sm font-bold">{article.title}</h6>
          <p className="text-xs font-medium text-gray-400">
            {article.source.name}
          </p>
        </div>
        <img
          className="rounded-md"
          width={70}
          src={article.urlToImage}
          alt="article-photo"
        />
      </div>
    </a>
  );
}
