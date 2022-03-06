function testUser() {
  const db = init('18CH__nrnpqpMXndqgyXiQL3xmCtl8TOk3_wd-7oNzbs')

  const columns = ['name', 'email']
  db.createSheetIfNotExists('users', columns)

  const userSheet = db.sheet('users')

  // insert one
  userSheet.insert({
    name: 'Asepudin',
    email: 'asep@gmail.com',
  })

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
  users = userSheet.find()

  // Get all data which email is 'binsarjr121@gmail.com'
  users = userSheet.find({
    email: {
      equal: 'binsarjr121@gmail.com',
    },
  })
  Logger.log('equal')
  Logger.log(users)

  users = userSheet.find({
    email: {
      not: { equal: 'binsarjr121@gmail.com' },
    },
  })
  Logger.log('not equal')
  Logger.log(users)

  Logger.log('like')
  Logger.log(
    userSheet.find({
      email: {
        like: '%gmail.com',
      },
    }),
  )

  Logger.log('not like')
  Logger.log(
    userSheet.find({
      email: {
        not: {
          like: '%gmail.com',
        },
      },
    }),
  )

  // Get all data with limit 2
  users = userSheet.find({
    $limit: 2,
  })

  // Object | null
  let user

  // findOne data asc
  user = userSheet.findOne()

  // findOne data which email is 'binsarjr121@gmail.com'
  user = userSheet.findOne({
    email: 'binsarjr121@gmail.com',
  })

  userSheet.update(user._id, {
    email: 'yowiss@gmail.com',
  })

  // delete data which email is "yowiss@gmail.com"
  userSheet.delete({
    email: 'yowiss@gmail.com',
  })

  // delete all data
  userSheet.delete()
}

function testDB() {
  const sheetId = '18CH__nrnpqpMXndqgyXiQL3xmCtl8TOk3_wd-7oNzbs'
  const db = init(sheetId)
  Logger.log(db.sheetApp.getUrl())
  const columns = ['ok', 'okei', 'sip']
  db.createSheetIfNotExists('tayo', columns)
  let tayoSheet = db.sheet('tayo')

  tayoSheet.insert([
    {
      ok: 'okasdasd',
      okei: 'asd',
      sip: 'asddd',
    },
    {
      ok: 'yo',
      okei: 'hai hai',
      sip: 'sip',
    },
    {
      ok: 'okasdasd',
      okei: 'asd',
      sip: 'asddd',
    },
    {
      ok: 'asdklmsad',
      okei: 'sqwe',
      sip: 'qwe',
    },
    {
      ok: 'okasdasd',
      okei: 'asd',
      sip: 'asddd',
    },
  ])

  let tayo = tayoSheet.find()
  Logger.log(
    tayoSheet.findOne({
      ok: 'yo',
    }),
  )
  tayoSheet.delete({
    ok: 'okasdasd',
  })
  tayo = tayoSheet.find()
  let updateTayo = tayo[0]
  tayoSheet.update(updateTayo._id, {
    sip: 'yowiss',
  })
  tayoSheet.delete()
}
