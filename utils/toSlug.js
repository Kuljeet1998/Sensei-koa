exports.fn= function slug(title) {
  var slug = title.split(' ').join('_');
  return slug
}