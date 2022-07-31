const alterAlert = (nameClass, text, method) => {
    const alert = document.getElementById('alert');
    alert.classList.add('alert');
    if (method === 'add') {
        alert.classList.add(nameClass);
    } else {
        alert.classList.remove(nameClass);
    }
    alert.innerHTML = text;
}

const handleErrorArray = (errorList) => {
    errorList.forEach((error) => {
        const field = error.field + "Help";
        const help = document.getElementById(field);
        if (help)
            help.innerHTML = error.error;
    })
}

function newUser(event) {
    const inputs = document.querySelectorAll('[data-input-edit="input"]');
    [...inputs].map(element => element.setAttribute("disabled", true));
    const helps = document.querySelectorAll('[data-input-edit="help"]');
    [...helps].map(element => element.innerHTML = "");
    const nome = event.target[0].value;
    const sobrenome = event.target[1].value;
    const body = {
        nome: nome.concat(" ", sobrenome),
        escola: event.target[2].value,
        turma: event.target[3].value,
        email: event.target[4].value,
        telefone: event.target[5].value,
        senha: "12345678"
    };
    alterAlert('alert-primary', 'Aguarde, cadastrando...', 'add');
    fetch('https://bsi-cadastro-usuarios.herokuapp.com/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(async (response) => {
            const responseJson = await response.json();
            if (response.status === 200) {
                alterAlert('alert-primary', 'Cadastro efetuado! Obrigado por participar!', 'add');
                setTimeout(() => window.history.back(), 1500);
            } else {
                [...inputs].map(element => element.removeAttribute("disabled"));
                alterAlert('alert-primary', 'Ops tivemos um erro...', 'remove');
                alterAlert('alert-danger', 'Houve um erro durante o cadastro, confira os campos digitados!', 'add');
                const { error } = responseJson;
                if (Array.isArray(error)) {
                    handleErrorArray(error);
                } else {
                    alterAlert('alert-danger', error, 'add');
                }
            }
        })
}