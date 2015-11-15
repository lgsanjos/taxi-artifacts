
function paymentMethodLabel(label) {
   var dic = [] ;
    dic['money'] = 'Dinheiro';
    dic['debt'] = 'Cartão Débito';
    dic['credit'] = 'Cartão Crédito';
   return dic[label] || '';
}

function sortRequestByTimeGenerated(requestA, requestB) {
  if (requestA.taxi) return 1;
  if (requestB.taxi) return -1;

  if (requestA.tryouts >= 5 || requestB.tryouts >= 5) 
    return requestB.tryouts - requestA.tryouts;

  return (requestB.timeGenerated - requestA.timeGenerated)
};


