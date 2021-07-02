import React,{useState,useEffect} from "react";
import {InputLabel,Select,MenuItem,Button,Grid,Typography} from "@material-ui/core";
import {useForm,FormProvider} from "react-hook-form";
import FormInput from "./CustomTextField";
import {commerce} from "../../lib/commerce";
import {Link} from "react-router-dom";

const AddressForm=({checkoutToken,next})=>{
    const [shippingCountries,setShippingCountries]=useState([]);
    const [shippingCountry,setShippingCountry]=useState('');
    const [shippingSubdivisions,setShippingSubdivisions]=useState([]);
    const [shippingSubdivision,setShippingSubdivision]=useState('');
    const [shippingOptions,setShippingOptions]=useState([]);
    const [shippingOption,setShippingOption]=useState('');

    const countries=Object.entries(shippingCountries).map(([code,name])=>({id:code,label:name}));
    const subdivisions=Object.entries(shippingSubdivisions).map(([code,name])=>({id:code,label:name}));
    const options=shippingOptions.map((sO)=>({id:sO.id,label:`${sO.description} - (${sO.price.formatted_with_symbol})`}));

    

    const fetchShippingCountries=async (checkoutTokenId)=>{
        const response=await commerce.services.localeListShippingCountries(checkoutTokenId);
        setShippingCountries(response.countries);
        setShippingCountry(Object.keys(response.countries)[0]);
    }
    
    const fetchSubdivisions=async (countryCode)=>{
        
        const {subdivisions}=await commerce.services.localeListSubdivisions(countryCode);
        setShippingSubdivisions(subdivisions);
        setShippingSubdivision(Object.keys(subdivisions)[0]);
    }

    //it's not working for US(Domestic)???
//     const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
//         const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region});
        
//             setShippingOptions(options);
//             setShippingOption(options[0].id);
    
//     console.log(options);
//   };

    useEffect(()=>{
        fetchShippingCountries(checkoutToken.id);
    },[]);

    useEffect(()=>{
      if(shippingCountry) fetchSubdivisions(shippingCountry);
    },[shippingCountry])

    // useEffect(()=>{
    //     if(shippingSubdivision) fetchShippingOptions(checkoutToken.id,shippingCountry,shippingSubdivision);
        
    // },[shippingSubdivision])
    
    
    
    
    const methods=useForm();
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data)=>next({...data,shippingCountry,shippingSubdivision}))}>
                    <Grid container spacing={3}>
                        <FormInput name="firstName" label="First name" required/>
                        <FormInput name="lastName" label="Last name" required/>
                        <FormInput name="address1" label="Address" required/>
                        <FormInput name="email" label="Email" required/>
                        <FormInput name="city" label="City" required/>
                        <FormInput name="zip" label="ZIP / Postal code" required/>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e)=> setShippingCountry(e.target.value)}>
                                {countries.map((country)=>(
                                    <MenuItem key={country.id} value={country.id}>{country.label}</MenuItem>
                                ))}
                                
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select value={shippingSubdivision} fullWidth onChange={(e)=> setShippingSubdivision(e.target.value)}>
                                {subdivisions.map((subdivision)=>(
                                    <MenuItem key={subdivision.id} value={subdivision.id}>{subdivision.label}</MenuItem>
                                ))}
                                
                            </Select>
                        </Grid>
                        {/* <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e)=> setShippingOption(e.target.value)}>
                                {options.map((option)=>(
                                    <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
                                ))}
                                
                            </Select>
                                </Grid> */}
                       <br/> 
                       <div style={{width:'100%',display:'flex',justifyContent:'space-between'}}>
                           <Button component={Link} to="/cart" variant="outlined">Back to Cart</Button>
                           <Button type="submit" color="primary" variant="contained">Next</Button>
                       </div>
                    </Grid>
                </form>
            </FormProvider>
        </React.Fragment>
    )
}

export default AddressForm;