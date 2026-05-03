export default defineEventHandler((event) => {
    // Allow being embedded in iframes for local dev
    setHeader(event, "X-Frame-Options", "ALLOWALL");
    // Or with CSP (modern way):
    // setHeader(event, 'Content-Security-Policy', "frame-ancestors *")
});
