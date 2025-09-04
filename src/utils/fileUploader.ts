// utils/fileUploader.ts
export default class FileUploader {
  static async uploadFile(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      // Create file input dynamically
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.style.display = "none";

      // Listen for file selection
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) {
          reject("No file selected");
          return;
        }

        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch(
            "https://fbapi.techicious.store/api/v2/upload/file",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const data = await response.json();
          // Construct final URL
          const finalUrl = `https://fbapi.techicious.store${data.file}`;
          resolve(finalUrl);
        } catch (err) {
          reject(err);
        }
      };

      // Trigger click to open file selector
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    });
  }
}
