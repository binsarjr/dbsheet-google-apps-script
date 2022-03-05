# DB Sheet Library for Google Apps Script

## create connection
```js
const db = dbsheet.init(sheetId)
```


## create sheet and header/column
```js
const columns = ['name','email']
db.createSheetIfNotExists('users', columns)
```


## select sheet
```js
const userSheet = db.sheet('users')
```

## Insert data
```js
// insert one
userSheet.insert(
    {
        name: 'Asepudin',
        email: 'asep@gmail.com',
    }
)

// insert many
userSheet.insert([
    {
        name: 'Binsar Dwi Jasuma',
        email: 'binsarjr121@gmail.com',
    },
    {
        name: 'Asepudin',
        email: 'asep@gmail.com',
    },
])
```

## Read Data
```js
// Array
let users

// Get all data
users= userSheet.find()

// Get all data which email is 'binsarjr121@gmail.com'
users= userSheet.find({
    email: 'binsarjr121@gmail.com'
})


// Get all data with limit 2
users= userSheet.find({
    $limit: 2
})

// Object | null
let user

// findOne data asc
user= userSheet.findOne()

// findOne data which email is 'binsarjr121@gmail.com'
user= userSheet.findOne({
    email: 'binsarjr121@gmail.com'
})
```

## Update Data
```js
userSheet.update(user._id, {
    email: "yowiss@gmail.com"
})
```

## Delete Data
```js
// delete data which email is "yowiss@gmail.com"
userSheet.delete({
    email: "yowiss@gmail.com"
})

// delete all data
userSheet.delete()
```

## Full Source Example
```js
const db = dbsheet.init(sheetId)

const columns = ['name','email']
db.createSheetIfNotExists('users', columns)

const userSheet = db.sheet('users')


// insert one
userSheet.insert(
    {
        name: 'Asepudin',
        email: 'asep@gmail.com',
    }
)

// insert many
userSheet.insert([
    {
        name: 'Binsar Dwi Jasuma',
        email: 'binsarjr121@gmail.com',
    },
    {
        name: 'Asepudin',
        email: 'asep@gmail.com',
    },
])



// Array
let users

// Get all data
users= userSheet.find()

// Get all data which email is 'binsarjr121@gmail.com'
users= userSheet.find({
    email: 'binsarjr121@gmail.com'
})


// Get all data with limit 2
users= userSheet.find({
    $limit: 2
})

// Object | null
let user

// findOne data asc
user= userSheet.findOne()

// findOne data which email is 'binsarjr121@gmail.com'
user= userSheet.findOne({
    email: 'binsarjr121@gmail.com'
})


userSheet.update(user._id, {
    email: "yowiss@gmail.com"
})


// delete data which email is "yowiss@gmail.com"
userSheet.delete({
    email: "yowiss@gmail.com"
})

// delete all data
userSheet.delete()
```