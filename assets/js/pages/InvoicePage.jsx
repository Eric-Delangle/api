import React, { useState, useEffect  } from 'react';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import { Link } from 'react-router-dom';
import CustomersApi from "../services/customersApi";
import InvoicesApi from "../services/invoicesApi";
import invoicesApi from '../services/invoicesApi';

const InvoicePage = ( { history, match  }) => {

    const{ id = "new"  }= match.params;

    const [ invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [ customers, setCustomers ] = useState([]);

    const [ editing, setEditing ] = useState(false);

     const [ errors, setErrors ] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    // Récuperation des clients.
    const fetchCustomers = async () =>{
        try {
           const data = await CustomersApi.findAll();
           setCustomers(data);
           if(!invoice.customer) setInvoice({ ...invoice, customer: data[0].id});
        } catch (error) {
            history.replace('/invoices');
            // flash notification erreur
        }
    }

    // Récuperation d'une facture.
    const fetchInvoice = async id => {

        try {
            const { amount, status, customer } = await InvoicesApi.find(id);
            setInvoice({ amount, status, customer: customer.id});
        } catch(error) {
            history.replace('/invoices');
            // flash notification erreur
        }
    }
   // Récupération de la liste des clients à chaque chargement du composant.
   useEffect(() => {
    fetchCustomers();
  }, []);

  // Récuperation de la bonne facture quand l'identifiant de l'url change.
  useEffect( () => {
    if( id !== "new") {
        setEditing(true);
        fetchInvoice(id);
    }
  }, [id] );

    // Gestion des changements des i nputs dans le formulaire.
    const handleChange = ({ currentTarget }) => {
        const { name, value }= currentTarget;
        setInvoice({ ...invoice, [name] : value });
    }

    // Gestion de la soumission du formulaire.
    const handleSubmit =  async (event) => {
        event.preventDefault();
        try {
            if(editing) {
                 await invoicesApi.update(id, invoice);
                    // flash notification success
            } else { 
                await InvoicesApi.create(invoice);
                // faire une notification flash
                history.replace("/invoices");
            }
        
        }catch ({ response }) {
            const { violations } = response.data;
      
            if (violations) {
              const apiErrors = {};
              violations.forEach(({ propertyPath, message }) => {
                apiErrors[propertyPath] = message;
              });
               setErrors(apiErrors);
        // flash notification d'erreur
           }
          } 
    }

    return ( 
        <>
        {(editing &&<h1>Modification d'une facture</h1>) || (<h1>Création d'une facture</h1>)}
        <form onSubmit= { handleSubmit }>
            <Field 
                name="amount" 
                type="number" 
                placeholder="Montant de la facture" 
                label="Montant" 
                onChange = { handleChange } 
                value= { invoice.amount } 
                error= { errors.amount }
                />
                <Select 
                    name="customer" 
                    label="Client" 
                    value ={ invoice.customer } 
                    error = { errors.customer }
                     onChange= { handleChange }
                     >
                        { customers.map(customer => 
                        <option key={ customer.id } value= { customer.id }>
                            { customer.firstName } { customer.lastName } 
                        </option>)}
                </Select>
                <Select 
                    name="status" 
                    label="Statut" 
                    value={ invoice.status } 
                    error = { errors.status} 
                    onChange = { handleChange}
                    >
                        <option value="SENT">Envoyée</option>
                        <option value="PAID">Payée</option>
                        <option value="CANCELLED">Annulée</option>
                </Select>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-link">
                        Retour aux factures
                    </Link>
                </div>
         </form>
        </>
     );
}
 
export default InvoicePage;