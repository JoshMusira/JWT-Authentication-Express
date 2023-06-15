
import sql from 'mssql';
import config from '../db/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user!' });
    }
};


export const register = async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Details WHERE username = @username OR email = @email');
        const user = result.recordset[0];
        if (user) {
            res.status(409).json({ error: 'User already exists' });
        } else {
            await pool.request()
                .input('username', sql.VarChar, username)
                .input('hashedpassword', sql.VarChar, hashedPassword)
                .input('email', sql.VarChar, email)
                .query('INSERT INTO Details (username, email, password) VALUES (@username, @email ,@hashedpassword)');
            res.status(200).send({ message: 'User created successfully' });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while creating the user' });
    } finally {
        sql.close();
    }

};

export const login = async (req, res) => {
    const { username, password } = req.body;
    let pool = await sql.connect(config.sql);
    const result = await pool.request()
        .input('username', sql.VarChar, username)
        .query('SELECT * FROM Details WHERE username = @username');
    const user = result.recordset[0];
    if (!user) {
        res.status(401).json({ error: 'Authentication failed. Wrong credentials.' });
    } else {
        if (!bcrypt.compareSync(password, user.password)) {
            res.status(401).json({ error: 'Authentication failed. Wrong credentials.' });
        } else {
            const token = `JWT ${jwt.sign({ username: user.username, email: user.email }, config.jwt_secret)}`;
            res.status(200).json({ email: user.email, username: user.username, id: user.id, token: token });
        }
    }

};




// import sql from 'mssql'
// import config from '../db/config.js'
// import bcrypt from 'bcrypt'
// import jwt  from 'jsonwebtoken'

// export const register = async (req, res) =>{
//     const {username,email, password} = req.body;
//     const hashedPassword = bcrypt.hashSync(password, 10);
    
//     try{
//         const userCon = await sql.connect(config.sql);
//         const result = await userCon.request()
//             .input('username', sql.VarChar, username)
//             .input('email', sql.VarChar, email)
//             .query('SELECT * FROM Details WHERE username = @username')
//             const user = result.recordset[0];
//             if(user){
//                 res.status(409).json({error: 'User already exist'})
//             }else{
//                 let pool  = await sql.connect(config.sql);

//                 await pool.request()
//                 .input('username', sql.VarChar, username)
//                 .input('hashedpassword', sql.VarChar, hashedPassword)
//                 .input('email', sql.VarChar, email)
//                 .query('INSERT INTO details (username, password,email) VALUES (@username, @hashedpassword, @email)')
        
//                 res.status(200).send({message: 'User created successfully'})
        

//             }

//     }
   
//     catch(err){
//         console.log(err)
//         res.status(500).json({error: 'An error occured while trying to create the User.'})


//     }
//     finally{
//         sql.close();

//     }

// }

// export const login = async (req, res) =>{
//     const {username,password} = req.body;
//     let pool = await sql.connect(config.sql)
//     const result  = await pool.request()
//     .input ('username', sql.VarChar, username)
//     .query('SELECT * FROM Details WHERE username = @username')
    
//     const user = result.recordset[0];
//     if (!user){
//         res.status(409).json({error:'Authentication failed.User not found'})
//     }
//     else{
//         if(!bcrypt.compareSync(password, user.hashedPassword)){
//             res.status(401).json({error: 'Authentication failed.Wrong password'})
//         }
//             else{
//                 const token = jwt.sign(
//                     {
//                         username:user.username, email:user.email
//                     },config.jwt_secret,{expiresIn : '1h'}

//                 );
//                 res.status(200).json({email:user.email, username: user.username,id :user.id, token: token})

//             }
        
//     }
// }