import { useLoaderData } from "@remix-run/react"
import { Modal } from "~/components/modal";
import { getUser, requireUserId } from "~/utils/auth.server";
import { useState } from "react";
import { FormField } from '~/components/form-field'
import { departments } from "~/utils/constants";
import { SelectBox } from "~/components/select-box";
import { validateName } from "~/utils/validators.server";
// Added the ActionFunction and redirect imports 👇
import { LoaderFunction, ActionFunction, redirect} from "@remix-run/node";
import { updateUser } from "~/utils/user.server";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request)
    return Response.json({ user })
}

export default function ProfileSettings() {
    const { user } = useLoaderData()

    const [formData, setFormData] = useState({
        firstName: user?.profile?.firstName,
        lastName: user?.profile?.lastName,
        department: (user?.profile?.department || 'MARKETING'),
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData(form => ({ ...form, [field]: event.target.value }))
    }

    return (
        <Modal isOpen={true} className="w-1/3">
            <div className="p-3">
                <h2 className="text-4xl font-semibold text-blue-600 text-center mb-4">Your Profile</h2>
                <div className="flex">
            <div className="flex-1">
              <form method="post">
                <FormField htmlFor="firstName" label="First Name" value={formData.firstName} onChange={e => handleInputChange(e, 'firstName')} />
                <FormField htmlFor="lastName" label="Last Name" value={formData.lastName} onChange={e => handleInputChange(e, 'lastName')} />
                <SelectBox
             className="w-full rounded-xl px-3 py-2 text-gray-400"
             id="department"
             label="Department"
             name="department"
             options={departments}
             value={formData.department}
             onChange={e => handleInputChange(e, 'department')}
                />
                <div className="w-full text-right mt-4">
                  <button className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-16 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1">
                    Save
                   </button>
                </div>
             </form>
          </div>
        </div>
            </div>
        </Modal>
    )
}

export const action: ActionFunction = async ({ request }) => {
    const userId = await requireUserId(request);

    const form = await request.formData();
    // 1
    let firstName = form.get('firstName')
    let lastName = form.get('lastName')
    let department = form.get('department')
 
    // 2
    if (
       typeof firstName !== 'string'
       || typeof lastName !== 'string'
       || typeof department !== 'string'
    ) {
       return Response.json({ error: `Invalid Form Data` }, { status: 400 });
    }
 
    // 3
    const errors = {
       firstName: validateName(firstName),
       lastName: validateName(lastName),
       department: validateName(department)
    }
 
    if (Object.values(errors).some(Boolean))
       return Response.json({ errors, fields: { department, firstName, lastName } }, { status: 400 });
 
    // Update the user here...
 
    // 4
    await updateUser(userId, {
        firstName,
        lastName,
        department: department as string
      })

    return redirect('/home')
 }