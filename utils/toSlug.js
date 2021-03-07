exports.get_slug= function slug(title) {
  var slug = title.split(' ').join('_');
  return slug
}