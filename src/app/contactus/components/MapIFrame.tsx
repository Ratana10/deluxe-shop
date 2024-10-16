interface Props {
  src: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

const MapIframe = ({ src, width = "100%", height = "100%", style }: Props) => {
  return (
    <iframe
      src={src}
      width={width}
      height={height}
      style={style}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default MapIframe;
