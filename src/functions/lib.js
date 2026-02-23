export const currency = (n, f) => {
  // by@fa:)
  if (!n) return 0;
  if (n < 1000) return (f ? f : "") + n;
  var s = n.toString().split("");
  var fd = s.length % 3;
  for (var i = fd == 0 ? 3 : fd, c = 0; i + c < s.length; i += 3, c += 1) {
    s.splice(i + c, 0, ".");
  }
  return (f ? f : "") + s.join("");
};
