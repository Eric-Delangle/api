import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pagination from '../components/Pagination';

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect( ()=>{
        axios.get("http://localhost:8000/api/invoices")
        .then(response => response.data["hydra:member"])
        .then(data => setInvoices(data))
        .catch(error => console.log(error.response));
    }, [])

    const handleDelete = (id) => {
        const originalInvoices = [...invoices];

        // 1. approche optimiste 
        setInvoices(invoices.filter(invoice => invoice.id !== id));

        //2. approche pessimiste
        axios
        .delete("http://localhost:8000/api/invoices/" + id )
        .then(response => console.log("ok"))
        .catch(error => {
            setCustomers(originalInvoices);
            console.log(error.response);
        });
    };

  const  handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const itemsPerPage = 30;
    const paginatedInvoices = Pagination.getData( 
        invoices, 
        currentPage, 
        itemsPerPage
        );

    return ( 
        <>
                <h1>Liste des factures</h1>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Chrono</th>
                            <th>Montant</th>
                            <th>Status</th>
                        </tr>
                    </thead>
               <tbody>
                 
                   { paginatedInvoices.map( invoice=>  ( 
                        <tr key ={invoice.id}>
                       <td>{invoice.id}</td>
                       <td>
                           {invoice.chrono}
                       </td>
                       <td>{invoice.amount}</td>
                       <td>{invoice.status}</td>
                       < td className="text-center">
                           <span className="badge badge-primary">{invoices.length}</span>
                        </td>
                        < td className="text-center">
                            
                        </ td >
                       <td>
                           <button 
                           onClick = { () => handleDelete(invoice.id)}
                           disabled = {invoices.length > 0}
                           className="btn btn-sm btn-danger">Supprimer</button>
                       </td>
                   </tr>
                    ) ) }
            
               </tbody>
                </table>
                <Pagination currentPage = {currentPage} itemsPerPage = {itemsPerPage} length = { invoices.length} onPageChanged = { handlePageChange}/>
               
                        </>
    );
}
 
export default InvoicesPage;