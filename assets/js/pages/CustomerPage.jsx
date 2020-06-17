import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import { default as CustomerApi, default as CustomersApi } from "../services/customersApi";

const CustomerPage = ( { match, history }) => {

   const {id ="new"} = match.params;

    const [ customer, setCustomer ]= useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [ errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    })

    const [ editing, setEditing] =useState(false);

    // Récuperation d'un customer en fonction de l'identifiant.
    const fetchCustomer = async id => { 
        try { 
            const { firstName, lastName, email, company }  = await CustomersApi.find(id);
            setCustomer({ firstName, lastName, email, company });
        } catch (error) {
    // notification flash d'une erreur
            history.replace("/customers");
        }
    }

    // Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant.
    useEffect( () => {
        if (id !== "new") { 
        setEditing(true);
        fetchCustomer(id)
        }
    }, [id]);
   
    // Gestion des changements des i nputs dans le formulaire.
    const handleChange = ({ currentTarget }) => {
        const { name, value }= currentTarget;
        setCustomer({ ...customer, [name] : value });
    }

    // Gestion de la soumission du formulaire
    const handleSubmit =  async event => {
        event.preventDefault();
      try {
          if (editing) {
             await CustomersApi.update(id, customer);
    // faire une flash notification de succès
          } else {
            await CustomerApi.create(customer);
    // faire une flash notification de succès
            props.history.replace("/customers");
          }
          setErrors({});
      } catch ({ response }) {
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
            {( !editing && <h1>Création d'un client.</h1>) ||( <h1>Modification du client.</h1>)}
            <form onSubmit= { handleSubmit }>
                <Field 
                    name = "lastName" 
                    label = "Nom de famille"
                    placeholder ="Nom de famille du client"  
                    value={ customer.lastName }
                    onChange = { handleChange }
                    error= { errors.lastName }
                />
                <Field 
                    name = "firstName" 
                    label = "Prénom" 
                    placeholder ="Prénom du client" 
                    value={ customer.firstName } 
                    onChange = { handleChange }
                    error= { errors.firstName }
                />
                <Field 
                    name = "email" 
                    label = "Email" 
                    placeholder ="Email du client"  
                    type = "email" 
                    value={ customer.email}
                    onChange = { handleChange }
                    error= { errors.email } 
                />
                <Field 
                    name = "company" 
                    label = "Entreprise" 
                    placeholder ="Entreprise du client" 
                    value={ customer.company } 
                    onChange = { handleChange }
                    error= { errors.company }
                />
                <div className="form-group">
                        <button type="submit" className="btn btn-success">
                            Enregistrer
                        </button>
                        <Link to="/customers" className="btn btn-link" >Retour à la liste </Link>
                </div>
            </form>
        </>
     );
}
 
export default CustomerPage;