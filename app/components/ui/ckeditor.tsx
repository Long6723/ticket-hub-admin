import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { FC } from "react";

interface CKEditorItemProps {
  value?: string;
  onChange?: (value: string) => void;
}

const CKEditorItem: FC<CKEditorItemProps> = ({ value = "", onChange }) => {
  return (
    <div className="ckeditor-wrapper">
      <CKEditor
        editor={ClassicEditor as any}
        data={value}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "link",
            "|",
            "numberedList",
            "bulletedList",
            "|",
            "blockQuote",
            "insertTable",
            "undo",
            "redo",
          ],
        }}
        onChange={(_, editor) => {
          const data = editor.getData();
          onChange?.(data);
        }}
      />
    </div>
  );
};

export default CKEditorItem;
