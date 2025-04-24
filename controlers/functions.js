
export const genrateotp=()=>{
    return String(Math.floor(1000 + Math.random() * 9000));
}
export const ValidateResource = (resources) => {
    try {
        if (!resources || !Array.isArray(resources)) {
            return false;
        }

        for (const resource of resources) {
            if (!resource.url || !resource.type) {
                return false;
            }

            // Validate resource type
            if (!["pdf", "video"].includes(resource.type)) {
                return false;
            }

            // URL Validation
            const urlPattern = /^(https?:\/\/[^\s]+)$/;
            if (!urlPattern.test(resource.url)) {
                return false;
            }

            // PDF validation
            if (resource.type === "pdf" && !resource.url.endsWith(".pdf")) {
                return false;
            }

            // Video validation (YouTube or Vimeo)
            if (resource.type === "video" && 
                !resource.url.includes("youtube.com") && 
                !resource.url.includes("youtu.be") && 
                !resource.url.includes("vimeo.com")) {
                return false;
            }
        }

        return true; // ✅ If all resources are valid
    } catch (error) {
        console.log(error);
        return false; // Always return false if an error occurs
    }
};
