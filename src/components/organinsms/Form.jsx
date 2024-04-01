import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import ReCAPTCHA from "react-google-recaptcha";

function Form() {
    const [formData, setFormData] = useState([]);
    const [isVerified, setIsVerified] = useState(false);
    const [isCaptchaSolved, setIsCaptchaSolved] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const [userInput, setUserInput] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [dia, setDia] = useState('');
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [sexo, setSexo] = useState('');
    const [estado, setEstado] = useState('');

    const handleCaptchaResponseChange = (response) => {
        if (response) {
            setIsVerified(true);
        }
    };
    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        let randomString = '';
        const characters = '6LcntpApAAAAAABa5Ndio61PfktpRp_ajCpddq2b';
        for (let i = 0; i < 5; i++) {
            randomString += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setCaptcha(randomString);
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (userInput !== captcha) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El captcha ingresado no coincide!',
            });
            generateCaptcha();
            setUserInput('');
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Bien hecho!',
                text: 'El captcha ingresado coincide.',
            });
            setIsCaptchaSolved(true);
            setUserInput('');
        }
    };

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    
    const generateCURP = () => {
        const vowels = 'AEIOU';
        const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
        let curp = removeAccents(apellidoPaterno[0] + (Array.from(apellidoPaterno.slice(1)).find(c => vowels.includes(c.toUpperCase())) || ''));
        curp += removeAccents(apellidoMaterno[0] + nombre[0]);
        curp += ano.slice(2) + (mes.length === 1 ? '0' + mes : mes) + (dia.length === 1 ? '0' + dia : dia);
        curp += sexo[0].toUpperCase();
        curp += estado ? estado.slice(0, 2).toUpperCase() : '';
        curp += removeAccents((Array.from(apellidoPaterno.slice(1)).find(c => consonants.includes(c.toUpperCase())) || ''));
        curp += removeAccents((Array.from(apellidoMaterno.slice(1)).find(c => consonants.includes(c.toUpperCase())) || ''));
        curp += removeAccents((Array.from(nombre.slice(1)).find(c => consonants.includes(c.toUpperCase())) || ''));
        return curp.toUpperCase();
    };

    const handleSubmitAlertDataForm = (event) => {
        event.preventDefault();
        const curp = generateCURP();
        setFormData([...formData, { curp, nombre, apellidoPaterno, apellidoMaterno, dia, mes, ano, sexo, estado }]);
        Swal.fire({
            title: 'Enviado!',
            text: 'Tu formulario ha sido enviado.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    };
    const handleDayChange = (e) => {
        const day = e.target.value;
        if (day < 1 || day > 31) {
            Swal.fire('Error', 'Day must be between 1 and 31', 'error');
            return;
        }
        if (mes === 2 && day > 29) {
            Swal.fire('Error', "February can't have more than 29 days", 'error');
            return;
        }
        if ([4, 6, 9, 11].includes(mes) && day > 30) {
            Swal.fire('Error', "This month can't have more than 30 days", 'error');
            return;
        }
        setDia(day);
    };

    const handleMonthChange = (e) => {
        const month = e.target.value;
        if (month < 1 || month > 12) {
            Swal.fire('Error', 'Month must be between 1 and 12', 'error');
            return;
        }
        setMes(month);
    };

    const handleYearChange = (e) => {
        const year = e.target.value;
    if (year <= 2024 && year >= 2000) {
        setAno(year);
    }
    };

    return ( 
        <>
            <div className="flex justify-center items-center min-h-screen">
                <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg'>
                    <form onSubmit={handleSubmit} className="mb-4">
                        <p className="text-lg font-bold text-center mb-4">Registro para CURP</p>
                        {!isCaptchaSolved && (
                            <>
                                <p className='text-center mb-2'>{captcha}</p>
                                <input type="text" value={userInput} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"/>
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">{isVerified ? 'Verificar' : 'Ingresar CAPTCHA'}</button>
                            </>
                        )}
                    </form>
                    <form onSubmit={handleSubmitAlertDataForm} className="mb-4">
                        <ReCAPTCHA sitekey="6LfneZ8pAAAAAPzbL6j0p6RvVyCVy3sy8_9p1e9a" onChange={handleCaptchaResponseChange} className="flex justify-center mb-4"/>
                        <label>
                            <input required="" placeholder="Nombre(s)" type="text" className="input mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled={!isVerified} onChange={e => setNombre(e.target.value)}/>
                        </label> 
                        <div className="flex gap-4">
                            <label>
                                <input required="" placeholder="Apellido Paterno" type="text" className="input mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled={!isVerified} onChange={e => setApellidoPaterno(e.target.value)}/>
                            </label>
                            <label>
                                <input required="" placeholder="Apellido Materno" type="text" className="input mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled={!isVerified} onChange={e => setApellidoMaterno(e.target.value)}/>
                            </label>
                        </div>       
                        <p className='text-center mt-4 mb-2'>Fecha De Nacimiento</p>
                        <div className="flex gap-4">
                            <label>
                                <input required="" placeholder="Día" type="number" className="input mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled={!isVerified} onChange={handleDayChange}/>
                            </label>
                            <label>
                                <input required="" placeholder="Mes" type="number" className="input mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled={!isVerified} onChange={handleMonthChange}/>
                            </label>
                            <label>
                                <input required="" placeholder="Año" type="number" className="input mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled={!isVerified} onChange={handleYearChange}/>
                            </label>
                        </div>    
                        <label>
                            <select className="input bg-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2" onChange={e => setSexo(e.target.value)}>
                                <option value="">Sexo</option>
                                <option value="hombre">Hombre</option>
                                <option value="mujer">Mujer</option>
                            </select>
                        </label>
                        <label>
                        <select className="input bg-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2" onChange={e => setEstado(e.target.value)}>
                            <option value="">Selecciona un estado</option>    
                            <option value="AS">Aguascalientes</option>
                            <option value="BC">Baja California</option>
                            <option value="BS">Baja California Sur</option>
                            <option value="CC">Campeche</option>
                            <option value="CS">Chiapas</option> 
                            <option value="CH">Chihuahua</option>
                            <option value="CL">Coahuila</option>
                            <option value="CM">Colima</option>
                            <option value="DG">Durango</option>
                            <option value="DF">Distrito Federal</option>
                            <option value="GT">Guanajuato</option>
                            <option value="GR">Guerrero</option>
                            <option value="HG">Hidalgo</option>
                            <option value="JC">Jalisco</option>
                            <option value="MN">Michoacán</option>
                            <option value="MS">Morelos</option>
                            <option value="MC">México</option>
                            <option value="NT">Nayarit</option>
                            <option value="NL">Nuevo León</option>
                            <option value="OC">Oaxaca</option>
                            <option value="PL">Puebla</option>
                            <option value="QT">Querétaro</option>
                            <option value="QR">Quintana Roo</option>
                            <option value="SP">San Luis Potosí</option>
                            <option value="SL">Sinaloa</option>
                            <option value="SR">Sonora</option>
                            <option value="TC">Tabasco</option>
                            <option value="TS">Tamaulipas</option>
                            <option value="TL">Tlaxcala</option>
                            <option value="VZ">Veracruz</option>
                            <option value="YN">Yucatán</option>
                            <option value="ZS">Zacatecas</option>                            
                                           
                        </select>
                    </label>
                    <div className="flex justify-center mt-5">
                        <button className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 w-full" disabled={!isVerified} onClick={handleSubmitAlertDataForm}>Generar CURP</button>
                    </div>
                </form>
            </div>
        </div>
            <table className="min-w-full leading-normal mt-8">
            <thead>
                <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CURP</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Apellido Paterno</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Apellido Materno</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha de Nacimiento</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sexo</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                </tr>
            </thead>
            <tbody>
            {formData.map((data, index) => (
                        <tr key={index}>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.curp}</td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.nombre}</td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.apellidoPaterno}</td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.apellidoMaterno}</td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{`${data.dia}/${data.mes}/${data.ano}`}</td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.sexo}</td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    </>
    );
}

export default Form;



