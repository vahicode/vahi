import  formidable  from  'formidable';


export default async function parseMultipartForm(req, res, next) {
	const  contentType = req.headers['content-type']
	if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
    const form = formidable({ multiples:  true })
		form.parse(req, (err, fields, files) => {
		  if (!err) {
		  	req.body = fields
		  	req.files = files
		  }
			next()
		})
	} 
  else next()
}

