import Head from 'next/head';

export default function CommentPolicy() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Comment Policy - Weeblo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-5 container mx-auto px-4 py-8">
        <section className="max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Welcome to Weeblo!</h2>
          <p className="mb-4">
            We value open discussion and constructive dialogue. Our comment section is a space for sharing ideas, insights, and feedback in a respectful manner. To maintain a positive and welcoming environment for all users, we have established the following comment policy:
          </p>
          <ol className="list-decimal pl-6 mb-6">
            <li className="mb-2"><strong>Respectful Conduct:</strong> Please treat others with respect and courtesy. Avoid personal attacks, harassment, hate speech, and discriminatory language. Disagreements are acceptable, but they must be expressed in a civilized manner.</li>
            <li className="mb-2"><strong>Relevance:</strong> Ensure that your comments are relevant to the topic of the article or post. Off-topic comments may be removed to maintain the focus of the discussion.</li>
            <li className="mb-2"><strong>No Spam or Self-Promotion:</strong> Do not spam the comment section with irrelevant links, advertisements, or self-promotional content. Comments solely intended for promoting products, services, or websites will be removed.</li>
            <li className="mb-2"><strong>No Offensive Content:</strong> Comments containing obscene, vulgar, or offensive language will not be tolerated. This includes any content that is sexually explicit, graphically violent, or otherwise inappropriate.</li>
            <li className="mb-2"><strong>Respect Privacy:</strong> Do not share personal information about yourself or others in the comment section. This includes but is not limited to phone numbers, email addresses, home addresses, or any other sensitive information.</li>
            <li className="mb-2"><strong>No Trolling:</strong> Deliberately inflammatory or provocative comments intended to disrupt the discussion or provoke other users will not be tolerated. Stay constructive and refrain from engaging in trolling behavior.</li>
            <li className="mb-2"><strong>Moderation:</strong> Comments are subject to moderation by our team. We reserve the right to remove any comments that violate our comment policy or are otherwise deemed inappropriate. Repeat offenders may be banned from participating in future discussions.</li>
            <li className="mb-2"><strong>Ownership and Licensing:</strong> By submitting a comment on our website, you grant us the right to display, reproduce, and distribute your comment in any form and media. However, you retain ownership of your comments and may request their removal at any time.</li>
            <li className="mb-2"><strong>Disclaimer:</strong> The views expressed in the comments belong to the individual users and do not necessarily reflect the views of [Your Website Name]. We are not responsible for the accuracy or completeness of any comments posted by users.</li>
            <li className="mb-2"><strong>Feedback and Reporting:</strong> If you encounter any comments that violate our comment policy or have concerns about the comment section, please report them to us immediately. We appreciate your feedback and assistance in maintaining a respectful community.</li>
          </ol>
          <p className="mb-4">By participating in the comment section, you agree to abide by our comment policy. Failure to comply with these guidelines may result in the removal of your comments and potential restrictions on your account.</p>
          <p>Thank you for being a part of our community and contributing to meaningful discussions on [Your Website Name]. We look forward to engaging with you in a positive and constructive manner.</p>
        </section>
      </main>
    </div>
  );
}
