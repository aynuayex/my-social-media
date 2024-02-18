export default function Footer() {
  return (
    <div className="mb-10 px-4 text-center text-gray-500">
      <small className="mb-2 block text-xs">
        &copy; 2023 Ayne Abreham Alemayehu. All rights reserved.
      </small>
      <p className="text-xs">
        <span className="font-semibold">About this website:</span> built with
        Next.js(v14), Redux/toolkit, TypeScript, Tailwind CSS, Shadcn-ui, Prisma,
        Neondb(postgresql), Clerk, Netlify hosting.
      </p>
    </div>
  );
}
