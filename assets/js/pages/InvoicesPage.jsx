import moment from "moment";
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesApi from "../services/invoicesApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ search, setSearch] = useState("");
    const [ loading, setLoading ] = useState(true);
    const itemsPerPage = 10;

    // Récuperation des factures auprès de l'api.
    const fetchInvoices = async () => {
        try {
            const data =  await InvoicesApi.findAll();
            setInvoices(data);
            setLoading(false);
        }
        catch (error)
        {
            toast.error("Erreur lors du chargement des factures");
        } 
    };

    // Charger les invoices au chargement du composant.
        useEffect(() => {
            fetchInvoices();
        }, []);

     //Gestion du changement de page
     const  handlePageChange = page => setCurrentPage(page);

     // Creation de la methode permettant de rechercher un customer en particulier
     const handleSearch = ({ currentTarget }) => {
         setSearch(currentTarget.value);
         setCurrentPage(1);
     }

    // Gestion de la date grâce à la librairie moment.js (on peut la transformer en service).
    const formatDate = (str) => moment(str).format("DD/MM/YYYY");

    //Gestion de la recherche
     const filteredInvoices = invoices.filter( 
         i => 
         i.customer.firstName.toLowerCase().includes( search.toLowerCase())||
        i.customer.lastName.toLowerCase().includes(search.toLowerCase())||
        i.amount.toString().startsWith(search.toLowerCase())||
        STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
     );

     // Gestion de la suppression d'une facture.
        const handleDelete = async id => {
            const originalInvoices = [...invoices];
            setInvoices(invoices.filter(invoice => invoice.id !== id));
            try {
                await InvoicesApi.delete(id);
                toast.success("La facture a bien été supprimée ");
            } catch (error) {
                toast.error("Une erreur est survenue");
                console.log(error.response);
                setInvoices(originalInvoices);
            }
        }

    // Pagination des données.
    const paginatedInvoices =  invoices.length > itemsPerPage ? Pagination.getData( 
        filteredInvoices, 
        currentPage, 
        itemsPerPage
        ) : invoices;

    return (
        <>
        <div className="d-flex justify-content-between align-items-center">
            <h1>Liste des factures</h1>
            <Link className="btn btn-primary" to="/invoices/new">
                Créer une facture
            </Link>
        </div>
            
            <div className="form-group">
                    <input type="text" className="form-control" onChange= { handleSearch } value = { search} placeholder = "Recherchez ..."  />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center">Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                {!loading && <tbody>
                    { paginatedInvoices.map(invoice => 
                        <tr key= {invoice.id}>
                            <td className="text-center">{ invoice.chrono }</td>
                        <td>
                            <Link to={"/customers/" + invoice.customer.id }>{ invoice.customer.firstName } { invoice.customer.lastName }</Link>
                        </td>
                        <td className="text-center">{ formatDate(invoice.sentAt) }</td>
                        <td className="text-center">
                            <span className={"badge badge-" + STATUS_CLASSES [invoice.status]}>
                                { STATUS_LABELS [invoice.status]}
                            </span>
                        </td>
                        <td className="text-center">{ invoice.amount.toLocaleString() } €</td>
                        <td>
                            <Link 
                                to={"/invoices/" + invoice.id } 
                                className="btn btn-sm btn-primary mr-1">
                                    Editer
                            </Link>
                            <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={ () => handleDelete(invoice.id)}>
                                        Supprimer
                            </button>
                        </td>
                    </tr>)}
                   
                </tbody>}
            </table>

            { loading && <TableLoader />}
            <Pagination currentPage = {currentPage} itemsPerPage = {itemsPerPage} length = { filteredInvoices.length} onPageChanged = { handlePageChange}/>
        </>
    )
   
    }

export default InvoicesPage;