export default function Ellipsis() {
    return (
        <div className="flex space-x-1 mt-8">
          <div className="w-2 h-2 bg-pending rounded-full animate-jump1"></div>
          <div className="w-2 h-2 bg-pending rounded-full animate-jump2"></div>
          <div className="w-2 h-2 bg-pending rounded-full animate-jump3"></div>
        </div>
      );
}