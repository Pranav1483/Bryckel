import React from "react";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";

 
const Test = () => {
  const editor = useCreateBlockNote();
 
  return (
    <div>
      <BlockNoteView editor={editor} />
      <div className={"edit-buttons"}>
        {/*Inserts a new block at start of document.*/}
        <button
          className={"edit-button"}
          onClick={() =>
            editor.insertBlocks(
              [
                {
                  content:
                    "This block was inserted at " +
                    new Date().toLocaleTimeString(),
                },
              ],
              editor.document[0],
              "before"
            )
          }>
          Insert First Block
        </button>
        {/*Updates the first block*/}
        <button
          className={"edit-button"}
          onClick={() =>
            editor.updateBlock(editor.document[0], {
              content:
                "This block was updated at " + new Date().toLocaleTimeString(),
            })
          }>
          Update First Block
        </button>
        {/*Removes the first block*/}
        <button
          className={"edit-button"}
          onClick={() => editor.removeBlocks([editor.document[0]])}>
          Remove First Block
        </button>
        {/*Replaces the first block*/}
        <button
          className={"edit-button"}
          onClick={() =>
            editor.replaceBlocks(
              [editor.document[0]],
              [
                {
                  content:
                    "This block was replaced at " +
                    new Date().toLocaleTimeString(),
                },
              ]
            )
          }>
          Replace First Block
        </button>
      </div>
    </div>
  );
}
 
export default Test;