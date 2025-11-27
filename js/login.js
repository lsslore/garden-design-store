function validarForm() {
  console.log("ValidarForm");
  const emailValido = "usuario@email.com";
  const pswValido = "123456";

  const usrEmail = document.getElementById('id_mail').value;
  const usrPsw = document.getElementById('id_psw').value;

  let esValido = true;

  //Condicionales para validar
  if(usrEmail.length < 1) {
    mostrarError('empty_email', 'Completa el email');
    esValido = false;
  } else {
    ocultarError('empty_email');
  }

  if(usrPsw.length < 1) {
    mostrarError('empty_psw', 'Completa la contraseña.');
    esValido = false;
  } else {
    ocultarError('empty_psw');
  }

  if(emailValido !== usrEmail || pswValido !== usrPsw) {
    mostrarError('login_error', 'Los datos no son correctos. ¡Intente de nuevo!');
    esValido = false;
  } else {
    ocultarError('login_error');
  }

  return esValido;

}

function mostrarError(fieldId, message) {
  const errorElement = document.getElementById(fieldId + '_error');
  errorElement.textContent = " ✗ " + message;
  errorElement.style.display = 'block';
}

function ocultarError(fieldId) {
  const errorElement = document.getElementById(fieldId + '_error');
  errorElement.style.display = 'none';
}


/*
Agregamos un listener a nuestro botón Ingresar , que al hacer click el usuario
sobre el mismo, se dispare la función de validarForm.
*/
const btnIngresar = document.getElementById('btn_login');
btnIngresar.addEventListener('click', function(event) {
  event.preventDefault;
  
  if(validarForm()) {
    window.location.href = "pages/tienda.html";
  }
});
