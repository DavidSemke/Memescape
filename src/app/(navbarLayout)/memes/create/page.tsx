export default function CreateMemePage() {
  const signedIn = true

  // Button for searchbar opens a panel below it when clicked
  // in which search results appear. It takes up the same area as
  // the image preview (when one is here, the other is gone).

  return (
    <main className="flex flex-col gap-4 items-center">
      <h1>Create Meme</h1>
      
      <button
        type="button"
        className="btn-primary"
      >
        Preview
      </button>
      <div className="hidden">Insert preview here</div>
    </main>
  )
}