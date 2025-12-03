(async()=>{
  try{
    const res = await fetch('http://localhost:3000/api/products');
    const j = await res.json();
    console.log('Productos:', JSON.stringify(j, null, 2));
  } catch(e){
    console.error('Error fetch products', e);
  }
})();
