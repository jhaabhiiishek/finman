const BillPayments = () => {
	return (
	  <div className="max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-lg">
		<h2 className="text-lg font-semibold">Bill Payments</h2>
		<select className="border p-2 w-full mt-2 rounded">
		  <option>Electricity Bill</option>
		  <option>Water Bill</option>
		  <option>Internet Bill</option>
		</select>
		<input className="border p-2 w-full mt-2 rounded" placeholder="Amount" />
		<button className="bg-purple-500 text-white py-2 px-4 rounded mt-3">Pay Bill</button>
	  </div> 
	);
  };
  
  export default BillPayments;
  