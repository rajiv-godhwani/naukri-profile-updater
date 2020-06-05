# naukri-profile-updater
Helps keep your naukri profile appear fresh in searches by recruiters

This is a AWS lambda ready script

To run it locally uncomment the following section in the script:

`// exports.handler({sheetsUrl:'https://sheet.best/api/sheets/10336906-1a0a-4665-a277-694662b8785f'},null,function(e){
//   console.log(e)
// })`

The function needs a pair of username,password in the following format, multiple pairs are allowed.
`[{'Username':'yournaukriusername','Password':'yournaukripassword'}]`
