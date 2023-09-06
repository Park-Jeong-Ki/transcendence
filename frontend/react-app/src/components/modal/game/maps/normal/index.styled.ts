import NormalMapSvg from "@assets/maps/mapNormal.svg";

export const ModalContent = {
  display: "absolute",
  inset: "auto",
  width: "800px",
  height: "600px",
  zIndex: 400,
  background: `url(${NormalMapSvg})`,
};

export const ModalOverlay = {
  background: "transparent",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};