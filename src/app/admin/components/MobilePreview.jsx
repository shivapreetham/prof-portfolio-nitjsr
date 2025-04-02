import React from "react";

const MobilePreview = () => {
  return (
    <div className="p-2 md:fixed overflow-hidden">
      {/* Mobile container styled to look like a mobile device */}
      <div className="border-[13px] min-w-[340px] w-full max-w-[400px] max-h-[650px] border-black h-screen rounded-[40px] m-2 shadow-md shadow-primary overflow-hidden">
        <iframe
          title="Mobile Preview"
          src={process.env.NEXT_PUBLIC_BASE_URL}
          width="100%"
          height="100%"
          className="rounded-[40px]"
          // scrolling="no"
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
};

export default MobilePreview;
