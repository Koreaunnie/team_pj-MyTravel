import React, { useState } from "react";
import { Box, Button, Image } from "@chakra-ui/react";
import { MdCancel } from "react-icons/md";

export function ReviewImageView({ files }) {
  const [showAll, setShowAll] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const MAX_IMAGES = 4;
  const displayedFiles = showAll ? files : files?.slice(0, MAX_IMAGES) || [];
  const remainingCount =
    files?.length > MAX_IMAGES ? files.length - MAX_IMAGES : 0;

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleModalClose = () => {
    setSelectedImageIndex(null);
  };

  const handlePrev = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : files.length - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev < files.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        {displayedFiles.map((file, index) => (
          <Box
            key={file.name}
            position="relative"
            m={2}
            cursor="pointer"
            onClick={() => handleImageClick(index)}
          >
            <Image
              src={file.src}
              boxSize="100px"
              objectFit="cover"
              border="1px solid black"
            />
            {index === MAX_IMAGES - 1 && remainingCount > 0 && !showAll && (
              <Box
                position="absolute"
                top="0"
                left="0"
                width="100px"
                height="100px"
                bg="rgba(0, 0, 0, 0.6)"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="lg"
                fontWeight="bold"
                cursor="pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAll(true);
                }}
              >
                +{remainingCount}
              </Box>
            )}
          </Box>
        ))}
        {showAll && files?.length > MAX_IMAGES && (
          <Button mt={2} onClick={() => setShowAll(false)}>
            줄이기
          </Button>
        )}
      </Box>

      {/* Modal for displaying the large image */}
      {selectedImageIndex !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          {/* Close button */}
          <button
            onClick={handleModalClose}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              border: "none",
              padding: "10px 15px",
              cursor: "pointer",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          >
            <MdCancel />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: "50%",
            }}
          >
            ❮
          </button>

          {/* Displayed image */}
          <img
            src={files[selectedImageIndex].src}
            alt="Large View"
            style={{
              maxWidth: "80vw",
              maxHeight: "80vh",
              objectFit: "contain",
              cursor: "default",
            }}
          />

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: "50%",
            }}
          >
            ❯
          </button>
        </div>
      )}
    </>
  );
}
