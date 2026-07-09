const isDev = import.meta.env.DEV;

export function imageUrl(
  url: string,
  options = "quality=80,format=auto"
) {
  if (isDev) return url;

  return `/cdn-cgi/image/${options}/${url}`;
}

export function responsiveImage(
  url: string,
  widths: number[]
) {
  if (isDev) {
    return {
      src: url,
      srcset: undefined,
    };
  }

  return {
    src: imageUrl(url, `width=${widths[0]},quality=80,format=auto`),
    srcset: widths
      .map(
        (w) =>
          `${imageUrl(url, `width=${w},quality=80,format=auto`)} ${w}w`
      )
      .join(", "),
  };
}