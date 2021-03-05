exports.full_path= async function attachment_path(host, attachments)
{
    for(var i=0; i<attachments.length; i++)
    {   
        attachments[i]['path'] = "https://" +host + "/" + attachments[i]['path']
    }
    return attachments
}