import Image from "next/image";
import Searchbar from "@/components/form/Searchbar";
import ImageGrid from "@/components/ImageGrid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function CreateMemePage() {
  const signedIn = true

  // Button for searchbar opens a panel below it when clicked
  // in which search results appear. It takes up the same area as
  // the image preview (when one is here, the other is gone).

  return (
    <main className="flex flex-col gap-4 items-center">
      <h1>Create Meme</h1>
      <section>
        <h2>Template</h2>
        <button 
          type='button' 
          className="btn-secondary"
          aria-label="Search for a template."
        >
          <MagnifyingGlassIcon 
            className="w-8 h-8"
          />
        </button>
        <label htmlFor='template'>Upload</label>
        <input 
          id='template'
          name='template'
          type='file'
        />
        <div>Insert search panel here</div>
        <div>Insert preview here</div>
      </section>
      <section>
        <h2>Text</h2>
        
        <label htmlFor='top'>Top</label>
        <input 
          id='top'
          name='top'
          type='text'
        />
        <label htmlFor='top-black'>Black</label>
        <input  
          id='top-black'
          name='top-color'
          type='radio'
          value='Black'
        />
        <label htmlFor='top-white'>White</label>
        <input  
          id='top-white'
          name='top-color'
          type='radio'
          value='White'
        />

        <label htmlFor='bottom'>Bottom</label>
        <input 
          id='bottom'
          name='bottom'
          type='text'
        />
        <label htmlFor='bottom-black'>Black</label>
        <input  
          id='bottom-black'
          name='bottom-color'
          type='radio'
          value='Black'
        />
        <label htmlFor='bottom-white'>White</label>
        <input  
          id='bottom-white'
          name='bottom-color'
          type='radio'
          value='White'
        />
      </section>
      <section>
        <h2>Metadata</h2>
        <label htmlFor='private'>Private?</label>
        <input  
          id='private'
          name='private'
          type='checkbox'
          value='private'
        />
      </section>
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