
const  generateMasseges = (entity) => ({
        alreadyExist : `${entity} already exist`,
        notFound : `${entity} not found`,
        createdSuccessfully : `${entity} created successfully`,
        updatedSuccessfully : `${entity} updated successfully`,
        deletedSuccessfully : `${entity} deleted successfully`,

        failedToCreate : `Failed to create ${entity}`,
        failedToUpdate : `Failed to update ${entity}`,
        failedToDelete : `Failed to delete ${entity}`
})



export const messages = {
    department : generateMasseges('Department'),
    supDepartment : generateMasseges('SupDepartment'),
    employee: generateMasseges('Employee'),
    user : {
        ...generateMasseges('User'),
        emailAlreadyExist : 'Email already exist',
        phoneAlreadyExist : 'Phone number already exist'
    }
}
