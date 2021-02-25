/*const { Pageable, IndexablePage, paginate } = require('@panderalabs/koa-pageable');


exports.fn= function getData(pageable){
  const pageNumber = pageable.page;
  const pageSize = pageable.size;
  const sort  = pageable.sort;

  const queryBuilder = Person.query().where('age', '>=', 21).page(pageNumber, pageSize);

  //If there is a sort, add each order element to the query's `orderBy`
  if (sort) {
    sort.forEach((property, direction) => queryBuilder.orderBy(property, direction));
  }  
  const result = await query.execute();

  return new IndexablePage(result.results, result.total, pageable); 
}*/